package rs.markisha.codetyperbackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.markisha.codetyperbackend.model.Score;

public interface ScoreRepository extends JpaRepository<Score, Integer> {

	List<Score> findAllBySnippetId(int codeSnippetId);

	boolean existsBySnippetIdAndUser(int snippetId, String username);
	Score findBySnippetIdAndUser(int snippetId, String username);

}
