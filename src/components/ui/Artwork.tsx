import { Image, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';

export function Artwork({
  source,
  alt,
  style,
}: {
  source: ImageSourcePropType;
  alt?: string;
  style: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={source}
      accessible={Boolean(alt)}
      accessibilityLabel={alt}
      resizeMode="cover"
      fadeDuration={0}
      style={style}
    />
  );
}
