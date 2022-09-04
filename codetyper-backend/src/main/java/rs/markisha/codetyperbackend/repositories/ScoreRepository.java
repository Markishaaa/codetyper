package rs.markisha.codetyperbackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import rs.markisha.codetyperbackend.model.Score;

public interface ScoreRepository extends JpaRepository<Score, Integer> {

	List<Score> findAllBySnippetId(@Param("id") int codeSnippetId);
	
}
