import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/main';

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Select a Chat Room")).toBeInTheDocument();
  });
});
