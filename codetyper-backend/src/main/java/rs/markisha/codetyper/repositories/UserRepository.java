package rs.markisha.codetyper.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rs.markisha.codetyper.model.User;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
