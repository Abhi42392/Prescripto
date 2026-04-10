import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FeedbackModal = ({
  appointmentId,
  backendUrl,
  utoken,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error("Please select a rating");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/submit-feedback`,
        { appointmentId, rating, comment },
        { headers: { utoken } },
      );
      if (data.success) {
        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rate your appointment</h2>

        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl focus:outline-none cursor-pointer"
            >
              <span
                className={
                  star <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-[#5f6FFF] text-white rounded-lg cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
