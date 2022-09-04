package rs.markisha.codetyperbackend.constants;

public class RoleConstants {
	
	public final static String USER = "hasAnyAuthority('USER', 'ADMIN')";
    public final static String ADMIN = "hasAuthority('ADMIN')";

}
