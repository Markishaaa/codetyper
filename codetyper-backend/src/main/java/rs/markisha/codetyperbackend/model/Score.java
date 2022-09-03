package rs.markisha.codetyperbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "score")
public class Score {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "accuracy", nullable = true)
	private Integer accuracy;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "wpm", nullable = false)
	private Integer wpm;
	
	@Column(name = "user", nullable = false, length = 50)
    private String user;
	
	@ManyToOne(optional = false)
    @JoinColumn(name = "snippet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CodeSnippet snippet;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getAccuracy() {
		return accuracy;
	}

	public void setAccuracy(Integer accuracy) {
		this.accuracy = accuracy;
	}

	public Integer getWpm() {
		return wpm;
	}

	public void setWpm(Integer wpm) {
		this.wpm = wpm;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public CodeSnippet getSnippet() {
		return snippet;
	}

	public void setSnippet(CodeSnippet snippet) {
		this.snippet = snippet;
	}

}
