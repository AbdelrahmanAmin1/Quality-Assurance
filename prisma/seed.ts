async function main() {
  console.log("No seed data is inserted. Register a real user through the app.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
