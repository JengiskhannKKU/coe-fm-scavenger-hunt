import localfont from "next/font/local";

export const maliFont = localfont({
    src: [
      {
        path: "./MaliThin-Regular.ttf",
        weight: "300",
      },
    ],
    variable: "--font-Mali",
  });

export const hetKhonFont = localfont({
    src: [
        {
            path: "./MN-Het-Khon.ttf",
            weight: "200",
        },
    ],
    variable: "--font-HetKhon",
});

export const morKhor = localfont({
  src: [
      {
          path: "./MorKhor1.ttf",
          weight: "200",
      },
      {
        path: "./MorKhor1.ttf",
        weight: "400", // Additional weight
      },
  ],
  variable: "--font-MorKhor",
});