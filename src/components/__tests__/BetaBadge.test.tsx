import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BetaBadge from "../BetaBadge";

describe("BetaBadge", () => {
    it("renders the beta badge button", () => {
        render(<BetaBadge />);
        const badgeButton = screen.getByText("Beta");
        expect(badgeButton).toBeInTheDocument();
    });

    it("shows the modal when clicked", () => {
        render(<BetaBadge />);
        const badgeButton = screen.getByText("Beta");

        // Click the badge
        fireEvent.click(badgeButton);

        // Modal should appear
        const modalTitle = screen.getByText("Beta Access");
        const closeButton = screen.getByText("Close");

        expect(modalTitle).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
    });

    it("closes the modal when close button is clicked", () => {
        render(<BetaBadge />);
        const badgeButton = screen.getByText("Beta");

        // Open the modal
        fireEvent.click(badgeButton);

        // Find and click the close button
        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);

        // Modal should be closed
        expect(screen.queryByText("Beta Access")).not.toBeInTheDocument();
    });
});
