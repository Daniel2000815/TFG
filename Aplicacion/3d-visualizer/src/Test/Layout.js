import { Content } from "./Content.js"
import { Box } from "./Box.js";

export const Layout = ({ children }) => (
  <Box
    css={{
      width: "100%"
    }}
  >
    {children}
    <Content />
  </Box>
);
