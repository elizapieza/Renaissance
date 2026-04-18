package rankAndSort;

import java.util.HashSet;
import java.util.Set;

public class RankJobs {

    public void rankJobs(JobListing[] jobs, SeekerPrefrences seeker) {
        for (JobListing job : jobs) {
            double score = 0.0;

            score += 20 * titleScore(job.getTitle(), seeker.getDesiredJobTitle());
            score += 10 * industryScore(job.getIndustry(), seeker.getDesiredIndustry());
            score += 10 * locationScore(job.getLocation(), seeker.getDesiredLocation());
            score += 15 * payScore(job.getMinPay(), seeker.getMinPayExpectation());
            score += 10 * educationScore(job.getEducationLevel(), seeker.getEducationLevel());
            score += 15 * textMatchScore(job.getQualifications(), seeker.getQualifications());
            score += 15 * textMatchScore(job.getRequirements(), seeker.getSkills());
            score += 5 * remoteScore(job.isRemote(), seeker.isRemotePreference());

            job.setRankingScore(score);
        }
    }

    private double titleScore(String jobTitle, String desiredTitle) {
        if (jobTitle == null || desiredTitle == null) return 0.0;

        String job = jobTitle.trim().toLowerCase();
        String desired = desiredTitle.trim().toLowerCase();

        if (job.equals(desired)) {
            return 1.0;
        } else if (job.contains(desired) || desired.contains(job)) {
            return 0.7;
        }

        return 0.0;
    }

    private double industryScore(String jobIndustry, String desiredIndustry) {
        if (jobIndustry == null || desiredIndustry == null) return 0.0;

        if (jobIndustry.trim().equalsIgnoreCase(desiredIndustry.trim())) {
            return 1.0;
        }

        return 0.0;
    }

    private double locationScore(String jobLocation, String desiredLocation) {
        if (jobLocation == null || desiredLocation == null) return 0.0;

        String job = jobLocation.trim().toLowerCase();
        String desired = desiredLocation.trim().toLowerCase();

        if (job.equals(desired)) {
            return 1.0;
        } else if (job.contains(desired) || desired.contains(job)) {
            return 0.6;
        }

        return 0.0;
    }

    private double payScore(double jobMinPay, double seekerMinPay) {
        if (jobMinPay >= seekerMinPay) {
            return 1.0;
        }

        double difference = seekerMinPay - jobMinPay;

        if (difference <= 10000) {
            return 0.7;
        } else if (difference <= 20000) {
            return 0.4;
        }

        return 0.0;
    }

    private double educationScore(String jobEducation, String seekerEducation) {
        int jobRank = getEducationRank(jobEducation);
        int seekerRank = getEducationRank(seekerEducation);

        if (jobRank == 0) return 0.0;
        if (seekerRank >= jobRank) return 1.0;
        if (seekerRank == jobRank - 1) return 0.5;

        return 0.0;
    }

    private int getEducationRank(String educationLevel) {
        if (educationLevel == null) return 0;

        String level = educationLevel.toLowerCase().replace(".", "");

        if (level.contains("high school") || level.contains("ged")) {
            return 1;
        } else if (level.contains("associate")) {
            return 2;
        } else if (level.contains("bachelor")) {
            return 3;
        } else if (level.contains("master")) {
            return 4;
        } else if (level.contains("doctor") || level.contains("phd")) {
            return 5;
        }

        return 0;
    }

    private double textMatchScore(String jobText, String seekerText) {
        if (jobText == null || seekerText == null) return 0.0;

        Set<String> jobWords = extractKeywords(jobText);
        Set<String> seekerWords = extractKeywords(seekerText);

        if (jobWords.isEmpty() || seekerWords.isEmpty()) return 0.0;

        int matches = 0;
        for (String word : jobWords) {
            if (seekerWords.contains(word)) {
                matches++;
            }
        }

        return (double) matches / jobWords.size();
    }

    private Set<String> extractKeywords(String text) {
        Set<String> words = new HashSet<>();

        String cleaned = text.toLowerCase()
                .replace(",", " ")
                .replace(".", " ")
                .replace("-", " ")
                .replace("/", " ");

        String[] splitWords = cleaned.split("\\s+");

        for (String word : splitWords) {
            if (word.length() > 2) {
                words.add(word);
            }
        }

        return words;
    }

    private double remoteScore(boolean jobRemote, boolean seekerRemotePreference) {
        return jobRemote == seekerRemotePreference ? 1.0 : 0.0;
    }
}