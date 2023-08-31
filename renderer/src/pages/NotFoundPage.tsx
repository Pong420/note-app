import { NavLink } from 'react-router-dom';
import { Box, Container, Group, Text } from '@mantine/core';

export function NotFoundPage() {
  return (
    <Container>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)'
        }}
      >
        <Box
          sx={{
            width: 'fit-content',
            padding: '0.5em 2.75em',
            fontSize: 60,
            fontWeight: 500,
            border: '0.1em solid'
          }}
        >
          404
        </Box>

        <Group position="apart" mt="md">
          <Text>We can't find the page you are looking for.</Text>
          <NavLink to="/">Back to home</NavLink>
        </Group>
      </Box>
    </Container>
  );
}
