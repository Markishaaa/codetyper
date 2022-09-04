package rs.markisha.codetyperbackend.payload;

public class ScoreCreateInfo {

	private int accuracy;
	private int wpm;
	private int codeSnippetId;
	private String user;

	public int getAccuracy() {
		return accuracy;
	}

	public void setAccuracy(int accuracy) {
		this.accuracy = accuracy;
	}

	public int getWpm() {
		return wpm;
	}

	public void setWpm(int wpm) {
		this.wpm = wpm;
	}

	public int getCodeSnippetId() {
		return codeSnippetId;
	}

	public void setCodeSnippetId(int codeSnippetId) {
		this.codeSnippetId = codeSnippetId;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

}
