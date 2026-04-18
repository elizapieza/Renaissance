package rankAndSort;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ApplicantRunner {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder input = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            input.append(line);
        }

        Gson gson = new Gson();
        ApplicantRanking request = gson.fromJson(input.toString(), ApplicantRanking.class);

        if (request == null) {
            System.out.println("{\"error\":\"Request was null\"}");
            return;
        }

        JobRequirements jobRequirements = request.getJobRequirements();
        ApplicantProfile[] applicants = request.getApplicants();

        if (jobRequirements == null) {
            System.out.println("{\"error\":\"Job requirements were null\"}");
            return;
        }

        if (applicants == null) {
            System.out.println("{\"error\":\"Applicants were null\"}");
            return;
        }

        RankApplicants ranker = new RankApplicants();
        ranker.rankApplicants(applicants, jobRequirements);

        SortApplicants sorter = new SortApplicants();
        sorter.sortApplicantsByScore(applicants);

        System.out.println(gson.toJson(applicants));
    }
}