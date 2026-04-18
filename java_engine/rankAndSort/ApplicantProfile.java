package rankAndSort;

public class ApplicantProfile {
    private int userId;
    private String firstName;
    private String lastName;
    private String educationLevel;
    private String skills;
    private String experience;
    private String bio;
    private double rankingScore;

    public int getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public String getSkills() {
        return skills;
    }

    public String getExperience() {
        return experience;
    }

    public String getBio() {
        return bio;
    }

    public double getRankingScore() {
        return rankingScore;
    }

    public void setRankingScore(double rankingScore) {
        this.rankingScore = rankingScore;
    }
}