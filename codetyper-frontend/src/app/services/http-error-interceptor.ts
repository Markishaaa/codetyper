import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";

export class HttpErrorInterceptor implements HttpInterceptor {
    
    constructor() { }
    
    intercept = (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error && error.error && error.error.message) {
                        // client-side error
                        errorMessage = error.error.message;
                        
                    } else {
                        errorMessage = JSON.stringify(error.message);
                        if (errorMessage === "\"Http failure response for http://localhost:8080/api/auth/login: 404 OK\"")
                            errorMessage = "Bad credentials" 
                    }

                    if (errorMessage !== "\"Http failure response for http://localhost:8080/api/auth/self: 401 OK\"")
                        window.alert(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }
}