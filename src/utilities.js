export const drawRectangle = (ctx, x, y, width, height, color) => {

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = "1";
    ctx.stroke();
};
