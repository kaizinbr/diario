// "use client";
// import { useState, useEffect } from "react";
// import { Avatar as UserAvatar } from "@mantine/core";
// import { createClient } from "@/utils/supabase/client";
// // import { extractColors } from "extract-colors";

// export default function Avatar({
//     src,
//     size,
//     className,
//     setCurrentColor,
//     isIcon,
// }: {
//     src: string | null;
//     size: number;
//     className?: string;
//     setCurrentColor?: (color: string) => void;
//     isIcon?: boolean;
// }) {
//     const supabase = createClient();
//     const [avatarSrc, setAvatarSrc] = useState<string | null>(src);
//     // console.log("Avatar src:", avatarSrc);

//     function updateColor(colors: { hex: string; intensity: number }[]) {
//         if (setCurrentColor) {
//             const maxIntensityColor = colors.reduce((prev, current) => {
//                 const prevIntensity = prev.intensity;
//                 const currentIntensity = current.intensity;
//                 return currentIntensity > prevIntensity ? current : prev;
//             });
//             setCurrentColor(maxIntensityColor.hex);
//             console.log("Color:", maxIntensityColor.hex);
//         }
//     }

//     useEffect(() => {
//         async function downloadImage(path: string) {
//             try {

//                 if (path.startsWith("https")) {
//                     setAvatarSrc(path);
//                     if (!isIcon) {
//                         try {
//                             extractColors(path)
//                                 .then((colors) => {
//                                     updateColor(colors);
//                                 })
//                                 .catch(console.error);
//                         } catch (error) {
//                             console.error("Error extracting colors:", error);
//                         }
//                     }
//                     return;
//                 }

//                 if (path.startsWith("data:image")) {
//                     setAvatarSrc(path);
//                     if (!isIcon) {
//                         try {
//                             extractColors(path)
//                                 .then((colors) => {
//                                     updateColor(colors);
//                                 })
//                                 .catch(console.error);
//                         } catch (error) {
//                             console.error("Error extracting colors:", error);
//                         }
//                     }
//                     return;
//                 }

//                 const { data } = supabase.storage
//                     .from("avatars")
//                     .getPublicUrl(path);

//                 setAvatarSrc(data.publicUrl);
//                 // console.log(data.publicUrl);
//                 if (!isIcon) {
//                     try {
//                         extractColors(data.publicUrl)
//                             .then((colors) => {
//                                 updateColor(colors);
//                             })
//                             .catch(console.error);
//                     } catch (error) {
//                         console.error("Error extracting colors:", error);
//                     }
//                 }

//                 // console.log("Downloaded image:", data);
//             } catch (error) {
//                 console.log("Error downloading image: ", error);
//             }
//         }

//         if (src) downloadImage(src);
//     }, [src, supabase]);

//     return (
//         <UserAvatar
//             src={avatarSrc}
//             alt="Avatar"
//             className={`
//                 ${className}
//                 size-6 !rounded-(--icon) text-woodsmoke-700
//             `}
//             size={size}
//         />
//     );
// }
