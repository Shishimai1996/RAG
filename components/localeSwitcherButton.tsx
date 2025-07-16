import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import TranslateIcon from "@mui/icons-material/Translate";
import { Button } from "@mui/material";

export const LocaleSwitcherButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <Button
      onClick={toggleLocale}
      sx={{
        position: "absolute",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        borderRadius: 60,
        height: "60px",
        width: "20px",
        bgcolor: "#252323",
        color: "#fff",
        border: "0.01px solid #ffffffae",
        boxShadow: "4px 6px 12px rgba(255, 255, 255, 0.39)",
        paddingX: 3,
        paddingY: 1.5,
        textTransform: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          bgcolor: "#727986",
          transform: "translateY(-2px)",
          boxShadow: "6px 8px 16px rgba(255, 255, 255, 0.5)",
        },
      }}
    >
      <TranslateIcon />
    </Button>
  );
};
