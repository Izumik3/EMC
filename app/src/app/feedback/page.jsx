import FeedbackForm from '../components/FeedbackForm';

export const metadata = {
  title: 'Написать нам | Электронный мастер-консультант',
  description: 'Форма обратной связи с автосервисом',
};

export default function FeedbackPage() {
  return (
    <div className="flex-1 flex flex-col items-center w-full py-8 px-4">
      <FeedbackForm />
    </div>
  );
}