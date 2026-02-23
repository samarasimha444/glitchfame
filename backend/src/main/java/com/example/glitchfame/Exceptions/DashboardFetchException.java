package com.example.glitchfame.Exceptions;

public class DashboardFetchException extends RuntimeException {

    public DashboardFetchException(String message) {
        super(message);
    }

    public DashboardFetchException(String message, Throwable cause) {
        super(message, cause);
    }
}