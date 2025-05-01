# 2.5 to 4 milligrams of caffeine per kilogram of body weight
# Source: https://www.efsa.europa.eu/sites/default/files/corporate_publications/files/efsaexplainscaffeine150527.pdf

import math

def compute_limit(weight = 150, gender = 'M'):
    limit = 0

    # By gender
    if (gender == 'M'):
        limit = weight * 3.5 + 10
    elif (gender == 'F'):
        limit = weight * 2.5 + 10
    else:
        limit = weight * 3.0 + 10

    # round limit to nearest decimal
    limit = math.ceil(limit * 10) / 10
    
    return limit