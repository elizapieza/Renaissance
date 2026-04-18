package rankAndSort;

public class SortApplicants {

    public void sortApplicantsByScore(ApplicantProfile[] applicants) {
        for (int i = 0; i < applicants.length - 1; i++) {
            int maxIndex = i;

            for (int j = i + 1; j < applicants.length; j++) {
                if (applicants[j].getRankingScore() > applicants[maxIndex].getRankingScore()) {
                    maxIndex = j;
                }
            }

            ApplicantProfile temp = applicants[i];
            applicants[i] = applicants[maxIndex];
            applicants[maxIndex] = temp;
        }
    }
}