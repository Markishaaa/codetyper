package rs.markisha.codetyperbackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import rs.markisha.codetyperbackend.model.CodeSnippet;

public interface CodeSnippetRepository extends JpaRepository<CodeSnippet, Integer> {
	
	@Query("select c.id from CodeSnippet c")
	List<Integer> getAllIds();
	
}
