export const Printer = (identifier = 'Hello World', data: any) => {
  console.log(
    `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-${identifier}-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,
  );
  console.log(data);
  console.log(
    `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-${identifier}-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,
  );
};
