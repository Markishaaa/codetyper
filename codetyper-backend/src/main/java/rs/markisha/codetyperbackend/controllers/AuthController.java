package rs.markisha.codetyperbackend.controllers;

import java.sql.Timestamp;

import javax.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rs.markisha.codetyperbackend.model.User;
import rs.markisha.codetyperbackend.model.UserRole;
import rs.markisha.codetyperbackend.payload.LoginRequest;
import rs.markisha.codetyperbackend.payload.MessageResponse;
import rs.markisha.codetyperbackend.payload.RegisterRequest;
import rs.markisha.codetyperbackend.repositories.UserRepository;
import rs.markisha.codetyperbackend.services.UserDetailsImpl;
import rs.markisha.codetyperbackend.utils.JwtUtils;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserRepository userRepo;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authManager;

	private final JwtUtils jwtUtils;

	public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, AuthenticationManager authManager,
			JwtUtils jwtUtils) {
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
		this.authManager = authManager;
		this.jwtUtils = jwtUtils;
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request, Errors errors) {
		if (userRepo.existsByUsername(request.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Username is already taken."));
		}
		if (userRepo.existsByEmail(request.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Email is already registered."));
		}
		if (request.getUsername().length() < 3) {
			return ResponseEntity.badRequest().body(new MessageResponse("Username is too short."));
		}
		
		if (errors.hasErrors()) {
			return ResponseEntity.badRequest().body(new MessageResponse("Email not valid."));
		}

		User user = new User();
		user.setUsername(request.getUsername());
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		user.setEmail(request.getEmail());

		// first user that registers will have the admin role
		user.setRole(userRepo.count() == 0 ? UserRole.ADMIN : UserRole.USER);

		userRepo.save(user);

		return ResponseEntity.ok().build();
	}
	
	@PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        if (!userRepo.existsByUsername(request.getUsername())) {
            return ResponseEntity.notFound().build();
        }

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        ResponseCookie cookie = jwtUtils.generateJwtCookies(userDetails);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        System.out.println(cookie);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    @GetMapping("/self")
    public ResponseEntity<?> getSelf() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth instanceof AnonymousAuthenticationToken) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        return ResponseEntity.ok(userRepo.findByUsername(userDetails.getUsername()));
    }
    
	@GetMapping("/getall")
	public ResponseEntity<?> getall() {
		return ResponseEntity.ok(userRepo.findAll());
	}
}