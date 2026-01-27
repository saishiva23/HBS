package com.hotel.entities;

public enum SuspensionReason {
    MULTIPLE_FAILED_LOGIN_ATTEMPTS("Multiple failed login attempts"),
    PAYMENT_FAILURES("Payment failures"),
    FRAUDULENT_TRANSACTIONS("Fraudulent transactions"),
    TERMS_AND_CONDITIONS_VIOLATION("Terms and conditions violation"),
    MULTIPLE_CANCELLATIONS("Multiple cancellations"),
    ADMIN_SUSPENDED("Suspended by admin"),
    ACCOUNT_UNDER_REVIEW("Account under review"),
    USER_REQUESTED_SUSPENSION("User requested suspension");

    private final String displayName;

    SuspensionReason(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
