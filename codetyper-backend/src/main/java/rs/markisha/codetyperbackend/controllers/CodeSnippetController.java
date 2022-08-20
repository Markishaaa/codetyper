package rs.markisha.codetyperbackend.controllers;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rs.markisha.codetyperbackend.model.CodeSnippet;
import rs.markisha.codetyperbackend.repositories.CodeSnippetRepository;

@RestController
@RequestMapping("/api/snippet")
public class CodeSnippetController {
	
	private final CodeSnippetRepository codeRepo;

	public CodeSnippetController(CodeSnippetRepository codeRepo) {
		this.codeRepo = codeRepo;
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<?> getSnippet(@PathVariable int id) {
        Optional<CodeSnippet> snippet = codeRepo.findById(id);

        if (snippet.isEmpty())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(snippet.get());
    }
	
	@GetMapping("/randomSnippet")
    public ResponseEntity<?> getRandomSnippet() {
		List<Integer> ids = codeRepo.getAllIds(); 
		Random rand = new Random();
		int randomId = ids.get(rand.nextInt(ids.size()));
		
        Optional<CodeSnippet> snippet = codeRepo.findById(randomId);
        
        if (snippet.isEmpty())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(snippet.get());
    }
	
}
