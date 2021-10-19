const dataTransform = (dies, graph, chartsStyles = []) => {
  const reformatDate = (date) => date.split("/").reverse().join("-");
  const range = [dies[0], dies[dies.length - 1]].map(reformatDate);
  const dates = dies.map(reformatDate);

  return graph.data.map(({ data, label }, index) => ({
    data,
    name: label,
    range,
    dates,
    ...(chartsStyles[index] ?? {}),
  }));
};

export default dataTransform;
