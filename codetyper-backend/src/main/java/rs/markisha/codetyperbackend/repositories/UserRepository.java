package rs.markisha.codetyperbackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rs.markisha.codetyperbackend.model.User;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
