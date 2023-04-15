import { Image as AntdImage } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export type Word = {
  WordText: string;
  Left: number;
  Top: number;
  Height: number;
  Width: number;
};

export type PreViewModalProps = {
  originImage?: File;
  words: Word[];
};

const SCALE_STEP = 0.2;

const PreviewModal = ({ originImage, words = [] }: PreViewModalProps) => {
  const [image, setImage] = useState<string>();

  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!originImage) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      words.forEach((word) => {
        const PADDING = 5;
        const boxWidth = word.Width + PADDING;
        const boxHeight = word.Height + PADDING;
        const boxX = word.Left - PADDING / 2;
        const boxY = word.Top - PADDING / 2;
        ctx.fillStyle = 'rgb(255 192 199 / 40%)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, [5]);
        ctx.stroke();
      });

      setImage(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(originImage);
  }, [originImage, words]);

  useEffect(() => {
    if (originImage) generateImage();
    else setImage(undefined);
  }, [generateImage, originImage]);

  return image ? (
    <AntdImage width={600} src={image} preview={{ scaleStep: SCALE_STEP }} />
  ) : null;
};

export default PreviewModal;
