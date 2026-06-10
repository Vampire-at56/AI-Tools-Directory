"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import StarRating from "./StarRating";

export default function ReviewForm({ toolId }) {
const [user, setUser] = useState(null);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

useEffect(() => {
const getUser = async () => {
const {
data: { user },
} = await supabase.auth.getUser();


  setUser(user);
};

getUser();


}, []);

const submitReview = async () => {
if (!user) {
alert("Please login first");
return;
}


const { error } = await supabase
  .from("reviews")
  .insert([
    {
      tool_id: toolId,
      user_id: user.id,
      rating,
      comment,
    },
  ]);

if (error) {
  alert(error.message);
  return;
}

setComment("");
setRating(5);

alert("Review added successfully!");

window.location.reload();


};

return ( <div className="border p-4 rounded-xl mt-4"> <h3>Write Review</h3>


  <StarRating
    rating={rating}
    setRating={setRating}
  />

  <textarea
    placeholder="Write your review..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

  <br />

  <button onClick={submitReview}>
    Submit Review
  </button>
</div>


);
}
