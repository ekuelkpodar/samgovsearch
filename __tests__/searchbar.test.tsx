import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  it("calls submit", () => {
    const onSubmit = jest.fn();
    render(
      <SearchBar
        query="test"
        onChange={() => {}}
        onSubmit={onSubmit}
        useAi={false}
        onToggleAi={() => {}}
      />
    );
    fireEvent.click(screen.getByText(/Search/i));
    expect(onSubmit).toHaveBeenCalled();
  });
});
