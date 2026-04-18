import re
from datetime import datetime

MONTHS = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12,
}

EMAIL_PATTERN = re.compile(r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b')
PHONE_PATTERN = re.compile(r'(\+?\d[\d\-\(\) ]{7,}\d)')
URL_PATTERN = re.compile(r'(https?://\S+|www\.\S+)')
YEAR_PATTERN = re.compile(r'\b(19\d{2}|20\d{2})\b')
AGE_PATTERN = re.compile(r'\b\d{1,2}\s*(years old|yrs old|yo)\b', re.IGNORECASE)
PRONOUN_PATTERN = re.compile(r'\b(he|she|him|her|his|hers)\b', re.IGNORECASE)
FAMILY_PATTERN = re.compile(
    r'\b(mother|father|mom|dad|wife|husband|girlfriend|boyfriend|pregnant|postpartum)\b',
    re.IGNORECASE
)
DATE_RANGE_PATTERN = re.compile(
    r'\b([A-Za-z]+)\s*(\d{4})\s*(?:-|–|to)\s*([A-Za-z]+)\s*(\d{4})\b',
    re.IGNORECASE
)


def calculate_duration(start_month, start_year, end_month, end_year):
    try:
        start = datetime(start_year, start_month, 1)
        end = datetime(end_year, end_month, 1)

        total_months = (end.year - start.year) * 12 + (end.month - start.month)

        years = total_months // 12
        months = total_months % 12

        parts = []
        if years > 0:
            parts.append(f"{years} year{'s' if years != 1 else ''}")
        if months > 0:
            parts.append(f"{months} month{'s' if months != 1 else ''}")

        return ' '.join(parts) if parts else '0 months'
    except Exception:
        return '[redacted duration]'


def replace_date_ranges(text: str) -> str:
    def replacer(match):
        start_month_str, start_year, end_month_str, end_year = match.groups()

        start_month = MONTHS.get(start_month_str.lower())
        end_month = MONTHS.get(end_month_str.lower())

        if not start_month or not end_month:
            return '[redacted duration]'

        return calculate_duration(
            start_month,
            int(start_year),
            end_month,
            int(end_year)
        )

    return DATE_RANGE_PATTERN.sub(replacer, text)


def sanitize_text(text: str) -> str:
    if not text:
        return ''

    sanitized = text

    # Convert date ranges first
    sanitized = replace_date_ranges(sanitized)

    sanitized = EMAIL_PATTERN.sub('[redacted email]', sanitized)
    sanitized = PHONE_PATTERN.sub('[redacted phone]', sanitized)
    sanitized = URL_PATTERN.sub('[redacted link]', sanitized)
    sanitized = AGE_PATTERN.sub('[redacted age]', sanitized)
    sanitized = YEAR_PATTERN.sub('[redacted year]', sanitized)
    sanitized = PRONOUN_PATTERN.sub('[redacted pronoun]', sanitized)
    sanitized = FAMILY_PATTERN.sub('[redacted personal detail]', sanitized)

    sanitized = re.sub(r'\s+', ' ', sanitized).strip()
    return sanitized


def sanitize_list(items):
    if not isinstance(items, list):
        return []
    return [sanitize_text(str(item)) for item in items if item and str(item).strip()]


def build_anonymous_seeker_profile(profile):
    return {
        'candidate_id': f'SEEKER-{profile.account.account_id}',
        'headline': 'Anonymous Candidate',
        'bio': sanitize_text(profile.bio or ''),
        'skills': sanitize_list(profile.skills),
        'experience': sanitize_list(profile.experience),
        'profile_completed': profile.profile_completed,
    }