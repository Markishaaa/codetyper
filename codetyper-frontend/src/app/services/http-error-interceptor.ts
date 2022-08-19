import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";

export class HttpErrorInterceptor implements HttpInterceptor {
    
    constructor() { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error && error.error && error.error.message) {
                        // client-side error
                        errorMessage = error.error.message;
                    } else if (error && error.message) {
                        // server-side error
                        errorMessage = error.message;
                    } else {
                        errorMessage = JSON.stringify(error);
                    }
                    window.alert(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }
}