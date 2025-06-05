import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, className, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Set up interval
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <span className={className}>
        Starting Soon
      </span>
    );
  }

  return (
    <span className={className}>
      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </span>
  );
}
