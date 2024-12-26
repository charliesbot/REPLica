import { FC } from "react";

type Props = {
  size: number;
};

const Spacer: FC<Props> = (props: Props) => {
  const { size } = props;

  return (
    <div
      style={{
        height: size,
        width: size,
      }}
    />
  );
};

export { Spacer };
