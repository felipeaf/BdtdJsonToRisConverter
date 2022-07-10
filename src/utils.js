export const coalesce = (...args) =>
  args.find(_ => ![null,undefined].includes(_)
);
  
export const nvl = (a,b) => a ? a: b;