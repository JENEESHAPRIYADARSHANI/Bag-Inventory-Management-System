package com.starbag.Payment_Management_Service.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropPaymentsTable {

    public static void main(String[] args) {
        String url = "jdbc:mysql://payment-management-db.cdcuu42sq3c8.eu-north-1.rds.amazonaws.com:3306/payment_management_db";
        String username = "admin";
        String password = "Payment2024!";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("Connected to database successfully!");
            
            // Drop payments table
            String dropTableSQL = "DROP TABLE IF EXISTS payments";
            stmt.executeUpdate(dropTableSQL);
            System.out.println("✓ Payments table dropped successfully!");

            // Show remaining tables
            System.out.println("\nRemaining tables:");
            var rs = stmt.executeQuery("SHOW TABLES");
            while (rs.next()) {
                System.out.println("  - " + rs.getString(1));
            }

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
