const fs = require('fs');
const beautify = require('js-beautify').html;

module.exports = async (file) => {
  const fileName = `${file}/pages/about.js`;
  const code = `
import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import ProTip from '../src/ProTip';
import Link from '../src/Link';

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <MuiLink color="inherit" href="https://sugarkubes.io">
        Sugarkubes
      </MuiLink>
      {' team.'}
    </Typography>
  );
}

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sugar Generator About Page
        </Typography>
        <Link href="/">Go to the main page</Link>
        <ProTip />
        <MadeWithLove />
      </Box>
    </Container>
  );
}
  `;
  fs.writeFileSync(fileName, code);
};
