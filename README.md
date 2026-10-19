# Tutorly-demo

Create a new Lovable project and send these prompts one at a time. Wait for each to finish and check the preview before the next.

"Build a simple booking app for a private tutor called Tutorly. Pages: home, sign up / log in, 'My bookings', and an 'Admin' page. Clean, simple design."

"Connect Supabase. Add email sign up and log in. Create a profiles table (id, full_name, role with default 'student') and a bookings table (id, user_id, subject, date, time, notes)."

"On 'My bookings' let a logged-in user create a booking and see their bookings."

"On the Admin page, list all bookings from all users. Show the Admin link only when the user's profile role is 'admin'."

"Seed 10 fake bookings for 3 fake students with clearly fake names like Test Student One."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tutor-time-harbor.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bc301283-35f9-4d56-8f37-599fa380c6cf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
