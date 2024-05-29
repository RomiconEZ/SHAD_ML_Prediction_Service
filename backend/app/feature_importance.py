import lightgbm as lgb

lgb_model = lgb.Booster(model_file="model.txt")


def get_dict_feature_importance():
    # Получение важности признаков и имен
    feature_importances = lgb_model.feature_importance(importance_type="gain")
    feature_names = lgb_model.feature_name()

    # Создание словаря признаков с их важностью, округленной до двух знаков после запятой
    feature_importance_dict = {
        name: round(float(importance), 2)
        for name, importance in zip(feature_names, feature_importances)
    }

    # Отбор пяти самых важных признаков
    top_five_features = dict(
        sorted(feature_importance_dict.items(), key=lambda item: item[1], reverse=True)[
            :5
        ]
    )

    return top_five_features
