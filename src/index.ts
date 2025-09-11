import app from './app.ts';

const port = process.env.PORT || 3000;

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();