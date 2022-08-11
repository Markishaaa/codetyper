package rs.markisha.codetyper.services;

import com.fasterxml.jackson.annotation.JsonIgnore;

import rs.markisha.codetyper.model.User;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@SuppressWarnings("serial")
public class UserDetailsImpl implements UserDetails {
    private String username;

    @JsonIgnore
    private String password;

    private GrantedAuthority authority;

    public UserDetailsImpl(String username, String password, GrantedAuthority authority) {
        this.username = username;
        this.password = password;
        this.authority = authority;
    }

    public static UserDetailsImpl build(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().toString());

        return new UserDetailsImpl(user.getUsername(), user.getPasswordHash(), authority);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return username.equals(that.username) && password.equals(that.password) && authority.equals(that.authority);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, password, authority);
    }
}
