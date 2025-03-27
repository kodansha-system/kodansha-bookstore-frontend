import { useState } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface IProps {
  data: {
    images: string[];
  };
}

const ProductSlider = ({ data }: IProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextSlide = () => {
    setSelectedIndex((prev) =>
      prev === data?.images?.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? data?.images?.length - 1 : prev - 1,
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-lg bg-white">
      <div className="relative flex items-center justify-center">
        <Image
          alt={`Product Image ${selectedIndex + 1}`}
          className="max-h-[300px] w-auto cursor-pointer object-contain"
          height={300}
          onClick={() => setIsOpen(true)}
          src={data?.images?.[selectedIndex]}
          width={500}
        />

        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black p-2 text-white opacity-20 hover:opacity-50"
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black p-2 text-white opacity-20 hover:opacity-50"
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {data?.images?.map((img: string, index: number) => (
          <div
            className={`cursor-pointer border-2 p-1 ${
              selectedIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            key={index}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              alt={`Thumbnail ${index + 1}`}
              className="size-[50px] object-cover"
              height={50}
              src={img}
              width={50}
            />
          </div>
        ))}
      </div>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="sm:max-w-[1000px]">
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-3xl p-4">
              <Image
                alt={`Product Image ${selectedIndex + 1}`}
                className="max-h-[500px] w-full object-contain"
                height={500}
                src={data?.images?.[selectedIndex]}
                width={500}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSlider;
