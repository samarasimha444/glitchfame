package com.example.glitchfame.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

// Handles exceptions where you explicitly set a status
@ExceptionHandler(ResponseStatusException.class)
public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {

    return ResponseEntity
            .status(ex.getStatusCode())
            .body(Map.of(
                    "status", ex.getStatusCode().value(),
                    "message", ex.getReason()
            ));
}

// Handles runtime errors from your application
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {

    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                    "status", HttpStatus.BAD_REQUEST.value(),
                    "message", ex.getMessage()
            ));
}

// Handles unexpected server crashes
@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {

    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                    "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "message", "Internal server error"
            ));
}


}
