package rs.markisha.codetyperbackend.controllers;

import java.sql.Timestamp;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import rs.markisha.codetyperbackend.model.User;
import rs.markisha.codetyperbackend.model.UserRole;
import rs.markisha.codetyperbackend.payload.MessageResponse;
import rs.markisha.codetyperbackend.payload.RegisterRequest;
import rs.markisha.codetyperbackend.repositories.UserRepository;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserRepository userRepo;

	private final PasswordEncoder passwordEncoder;

	public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder) {
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestParam RegisterRequest request) {
		if (userRepo.existsByUsername(request.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Username is already taken."));
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
	
	@GetMapping("/getall")
	public ResponseEntity<?> getall() {
		return ResponseEntity.ok(userRepo.findAll());
//		return ResponseEntity.ok().build();
	}


}