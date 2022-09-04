package rs.markisha.codetyperbackend.controllers;

import java.util.Optional;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rs.markisha.codetyperbackend.constants.RoleConstants;
import rs.markisha.codetyperbackend.model.CodeSnippet;
import rs.markisha.codetyperbackend.model.Score;
import rs.markisha.codetyperbackend.payload.ScoreCreateInfo;
import rs.markisha.codetyperbackend.repositories.CodeSnippetRepository;
import rs.markisha.codetyperbackend.repositories.ScoreRepository;

@RestController
@RequestMapping("/api/score")
public class ScoreController {

	private final ScoreRepository scoreRepo;
	private final CodeSnippetRepository snippetRepo;

	public ScoreController(ScoreRepository scoreRepo, CodeSnippetRepository snippetRepo) {
		this.scoreRepo = scoreRepo;
		this.snippetRepo = snippetRepo;
	}
	
	@PostMapping("/createScore")
    @PreAuthorize(RoleConstants.USER)
    public ResponseEntity<?> createScore(@Valid @RequestBody ScoreCreateInfo createInfo) {
		if (!scoreRepo.existsById(createInfo.getCodeSnippetId())) {
            return ResponseEntity.badRequest().build();
        }
		
		CodeSnippet snippet = snippetRepo.getById(createInfo.getCodeSnippetId());
		
		Score score = new Score();
		score.setSnippet(snippet);
		score.setUser(createInfo.getUser());
		score.setAccuracy(createInfo.getAccuracy());
		score.setWpm(createInfo.getWpm());
		
		scoreRepo.save(score);
		
		return ResponseEntity.ok(score);
	}
	
	@GetMapping("/getBySnippet/{codeSnippetId}")
	public ResponseEntity<?> getBySnippet(@PathVariable int codeSnippetId) {
		return ResponseEntity.ok(scoreRepo.findAllBySnippetId(codeSnippetId));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getScore(@PathVariable int id) {
		Optional<Score> score = scoreRepo.findById(id);
		
		if (score.isEmpty())
			return ResponseEntity.notFound().build();
		
		return ResponseEntity.ok(score.get());
	}
	
}
