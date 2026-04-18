package rankAndSort;

import java.util.HashSet;
import java.util.Set;

public class RankApplicants {

    public void rankApplicants(ApplicantProfile[] applicants, JobRequirements job) {
        for (ApplicantProfile applicant : applicants) {
            double score = 0.0;

            score += 20 * educationScore(applicant.getEducationLevel(), job.getRequiredEducation());
            score += 30 * textMatchScore(applicant.getSkills(), job.getRequirements());
            score += 25 * textMatchScore(applicant.getExperience(), job.getQualifications());
            score += 15 * textMatchScore(applicant.getBio(), job.getDescription());
            score += 10 * keywordBonus(applicant.getSkills(), applicant.getExperience(), job.getRequirements(), job.getQualifications());

            applicant.setRankingScore(score);
        }
    }

    private double educationScore(String applicantEducation, String requiredEducation) {
        int applicantRank = getEducationRank(applicantEducation);
        int requiredRank = getEducationRank(requiredEducation);

        if (requiredRank == 0) return 0.0;
        if (applicantRank >= requiredRank) return 1.0;
        if (applicantRank == requiredRank - 1) return 0.5;

        return 0.0;
    }

    private int getEducationRank(String educationLevel) {
        if (educationLevel == null) return 0;

        String level = educationLevel.toLowerCase().replace(".", "");

        if (level.contains("high school") || level.contains("ged")) return 1;
        if (level.contains("associate")) return 2;
        if (level.contains("bachelor")) return 3;
        if (level.contains("master")) return 4;
        if (level.contains("doctor") || level.contains("phd")) return 5;

        return 0;
    }

    private double textMatchScore(String applicantText, String jobText) {
        if (applicantText == null || jobText == null) return 0.0;

        Set<String> applicantWords = extractKeywords(applicantText);
        Set<String> jobWords = extractKeywords(jobText);

        if (applicantWords.isEmpty() || jobWords.isEmpty()) return 0.0;

        int matches = 0;
        for (String word : jobWords) {
            if (applicantWords.contains(word)) {
                matches++;
            }
        }

        return (double) matches / jobWords.size();
    }

    private double keywordBonus(String skills, String experience, String requirements, String qualifications) {
        double score = 0.0;

        score += textMatchScore(skills, requirements);
        score += textMatchScore(experience, qualifications);

        return Math.min(score / 2.0, 1.0);
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
}