package rankAndSort;

public class Main {
    public static void main(String[] args) {
        Main app = new Main();

        System.out.println("Job Listings:");
        JobListing[] jobs = app.createJobListings();
        for (JobListing job : jobs) {
            System.out.println("- " + job.getTitle() + " at " + job.getCompany());
        }

        System.out.println("------------------------------");

        System.out.println("\nSeeker Preferences:");
        SeekerPrefrences[] seekers = app.createSeekerPrefrences();
        for (SeekerPrefrences seeker : seekers) {
            System.out.println("- " + seeker.getDesiredJobTitle() + " in " + seeker.getDesiredLocation());
        }

        RankJobs ranker = new RankJobs();
        ranker.rankJobs(jobs, seekers[0]);

        SortJobs sorter = new SortJobs();
        sorter.sortJobsByScore(jobs);

        System.out.println("\nRanked and Sorted Job Listings:");
        for (JobListing job : jobs) {
            System.out.println("- " + job.getTitle() + " at " + job.getCompany() + " | Score: " + job.getRankingScore());
        }
    }

    public JobListing[] createJobListings() {
        JobListing job1 = new JobListing(
                "Software Engineer",
                "Walt Disney World",
                "Technology",
                "Orlando, FL",
                "Bachelors",
                "Bachelor's Degree in Computer Science",
                "Java, Python, C++",
                "Develop and maintain software applications for the theme park.",
                true,
                70000.00
        );

        JobListing job2 = new JobListing(
                "Algorithm Developer",
                "Google",
                "Technology",
                "Mountain View, CA",
                "Masters",
                "Master's Degree in Computer Science",
                "Python, Machine Learning, Data Structures",
                "Design and implement algorithms for search and recommendation systems.",
                false,
                120000.00
        );

        JobListing job3 = new JobListing(
                "Inspector",
                "USDA",
                "Government",
                "Washington, D.C.",
                "High School",
                "High School Diploma",
                "Attention to Detail, Communication Skills",
                "Inspect and ensure compliance with safety regulations in various industries.",
                false,
                45000.00
        );

        JobListing job4 = new JobListing(
                "K-9 Handler",
                "US Army",
                "Military",
                "Fort Bragg, NC",
                "High School",
                "High School Diploma",
                "Physical Fitness, Animal Handling, Teamwork",
                "Train and handle military working dogs for various missions.",
                false,
                40000.00
        );

        JobListing job5 = new JobListing(
                "Business Professor",
                "Methodist University",
                "Education",
                "Fayetteville, NC",
                "Docterate",
                "Ph.D. in Business Administration",
                "Teaching, Research, Communication Skills",
                "Teach undergraduate and graduate courses in business administration.",
                true,
                80000.00
        );

        return new JobListing[]{job1, job2, job3, job4, job5};
    }

    public SeekerPrefrences[] createSeekerPrefrences() {
        SeekerPrefrences seeker1 = new SeekerPrefrences(
                "Software Engineer",
                "Technology",
                "Fayetteville, NC",
                "Bachelors",
                "Bachelor's Degree in Computer Science",
                "Java, Python, C++",
                true,
                100000.00
        );

        return new SeekerPrefrences[]{seeker1};
    }
}