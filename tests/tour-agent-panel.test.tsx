// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TourAgentPanel } from "@/components/tour-agent-panel";
import { tourCues } from "@/lib/coffee-tour";
afterEach(cleanup);
it("keeps illustrated calls, human correction and totals synchronized when seeking backwards", async () => {
  const { rerender } = render(<TourAgentPanel time={tourCues.filter + 0.1} />);
  expect(screen.getByText("set_coffee_filter")).toBeTruthy();
  expect(screen.getByText("€1,314")).toBeTruthy();
  rerender(<TourAgentPanel time={tourCues.remove + 0.1} />);
  expect(screen.getByText("Human action")).toBeTruthy();
  expect(screen.getByText("€1,290")).toBeTruthy();
  rerender(<TourAgentPanel time={0} />);
  expect(screen.queryByText("set_coffee_filter")).toBeNull();
  expect(screen.getByText("Waiting for the requirements")).toBeTruthy();
  await userEvent.click(
    screen.getByRole("button", { name: "Collapse MCP activity" }),
  );
  expect(
    screen
      .getByRole("button", { name: "Expand MCP activity" })
      .getAttribute("aria-expanded"),
  ).toBe("false");
});
