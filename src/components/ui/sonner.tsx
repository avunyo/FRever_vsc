import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner 
  duration={2000}
  toastOptions={{
    style: {
      fontSize: '12px',            // Делаем текст меньше
      padding: '8px 12px',         // Уменьшаем отступы (само уведомление станет меньше)
      background: '#f8f9fa',       // Светло-серый фон (чтобы не сливался с чисто белым)
      border: '1px solid #e9ecef', // Тонкая граница
      borderRadius: '10px',        // Округлые углы
    },
    className: "dark:bg-[#1A1F1E] dark:text-white dark:border-white/10" // Для темной темы
  }}
/>
  );
};

export { Toaster, toast };
